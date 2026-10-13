import oracledb from 'oracledb'

// Enable object output format by default (returns { COLUMN_NAME: value } instead of array)
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT
oracledb.autoCommit = true

export interface OracleConfig {
  user: string
  password: string
  connectString: string
}

export function getOracleConfig(): OracleConfig {
  return {
    user: process.env.ORACLE_USER || 'researchhub',
    password: process.env.ORACLE_PASSWORD || 'researchhub',
    connectString: process.env.ORACLE_CONNECT_STRING || 'localhost:1521/XEPDB1'
  }
}

/**
 * Get an active Oracle database connection.
 * Caller must close the connection using `await conn.close()` when done.
 */
export async function getOracleConnection(): Promise<oracledb.Connection> {
  const config = getOracleConfig()
  return await oracledb.getConnection(config)
}

/**
 * Test connectivity to the local Oracle Database.
 */
export async function checkOracleConnection() {
  let conn: oracledb.Connection | null = null
  try {
    conn = await getOracleConnection()
    const result: any = await conn.execute(
      `SELECT sys_context('userenv', 'db_name') AS DB_NAME,
              sys_context('userenv', 'con_name') AS CON_NAME,
              sys_context('userenv', 'session_user') AS CURRENT_USER
       FROM DUAL`
    )
    return {
      connected: true,
      info: result.rows?.[0] || {},
      error: null
    }
  } catch (error: any) {
    return {
      connected: false,
      info: null,
      error: error.message || 'Failed to connect to Oracle'
    }
  } finally {
    if (conn) {
      try {
        await conn.close()
      } catch (_) {}
    }
  }
}

/**
 * Execute a SELECT query on Oracle Database.
 */
export async function runOracleQuery<T = any>(sql: string, binds: any = {}): Promise<T[]> {
  let conn: oracledb.Connection | null = null
  try {
    conn = await getOracleConnection()
    const result: any = await conn.execute(sql, binds)
    return (result.rows as T[]) || []
  } finally {
    if (conn) {
      try {
        await conn.close()
      } catch (_) {}
    }
  }
}

/**
 * Execute a PL/SQL block or procedure and capture DBMS_OUTPUT lines.
 */
export async function runOracleProcedure(plsqlBlock: string, binds: any = {}): Promise<string[]> {
  let conn: oracledb.Connection | null = null
  try {
    conn = await getOracleConnection()
    // 1. Enable DBMS_OUTPUT buffer
    await conn.execute('BEGIN DBMS_OUTPUT.ENABLE(32768); END;')

    // 2. Run the target PL/SQL procedure / block
    await conn.execute(plsqlBlock, binds)

    // 3. Fetch all buffered DBMS_OUTPUT lines
    const fetchScript = `
      DECLARE
        l_lines DBMS_OUTPUT.CHARARR;
        l_numlines NUMBER := 100;
      BEGIN
        DBMS_OUTPUT.GET_LINES(l_lines, l_numlines);
        :lines := l_lines;
        :numlines := l_numlines;
      END;
    `
    const outputResult: any = await conn.execute(fetchScript, {
      lines: { type: oracledb.STRING, dir: oracledb.BIND_OUT, maxArraySize: 100 },
      numlines: { type: oracledb.NUMBER, dir: oracledb.BIND_INOUT, val: 100 }
    })

    const rawLines: string[] = outputResult.outBinds?.lines || []
    return rawLines.filter((line) => line !== null && line !== undefined)
  } finally {
    if (conn) {
      try {
        await conn.close()
      } catch (_) {}
    }
  }
}

/**
 * Execute DML (INSERT, UPDATE, DELETE) against Oracle.
 */
export async function executeOracleDML(sql: string, binds: any = {}): Promise<number> {
  let conn: oracledb.Connection | null = null
  try {
    conn = await getOracleConnection()
    const result = await conn.execute(sql, binds, { autoCommit: true })
    return result.rowsAffected || 0
  } finally {
    if (conn) {
      try {
        await conn.close()
      } catch (_) {}
    }
  }
}
