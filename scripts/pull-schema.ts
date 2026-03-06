import "dotenv/config";
import postgres from "postgres";
import { writeFileSync } from "fs";
import { join } from "path";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const sql = postgres(process.env.DATABASE_URL);

async function pullSchema() {
  try {
    // Get all tables
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    let schemaContent = `import { pgTable, text, timestamp, uuid, boolean, integer, jsonb, varchar } from "drizzle-orm/pg-core";\n\n`;

    for (const table of tables) {
      const tableName = table.table_name;
      
      // Get columns for this table
      const columns = await sql`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns
        WHERE table_schema = 'public' 
        AND table_name = ${tableName}
        ORDER BY ordinal_position;
      `;

      // Get primary keys
      const primaryKeys = await sql`
        SELECT column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
          ON tc.constraint_name = kcu.constraint_name
        WHERE tc.table_schema = 'public'
        AND tc.table_name = ${tableName}
        AND tc.constraint_type = 'PRIMARY KEY';
      `;

      const pkColumns = primaryKeys.map((pk: any) => pk.column_name);

      schemaContent += `export const ${tableName} = pgTable("${tableName}", {\n`;

      for (const col of columns) {
        const colName = col.column_name;
        const dataType = col.data_type;
        const isNullable = col.is_nullable === "YES";
        const maxLength = col.character_maximum_length;

        let drizzleType = "";

        if (dataType === "uuid") {
          drizzleType = "uuid()";
        } else if (dataType === "text" || dataType === "character varying") {
          drizzleType = maxLength ? `varchar({ length: ${maxLength} })` : "text()";
        } else if (dataType === "timestamp with time zone" || dataType === "timestamp without time zone") {
          drizzleType = "timestamp()";
        } else if (dataType === "boolean") {
          drizzleType = "boolean()";
        } else if (dataType === "integer" || dataType === "bigint" || dataType === "smallint") {
          drizzleType = "integer()";
        } else if (dataType === "jsonb" || dataType === "json") {
          drizzleType = "jsonb()";
        } else {
          drizzleType = `text() /* ${dataType} */`;
        }

        const nullable = isNullable ? "" : ".notNull()";
        const isPrimaryKey = pkColumns.includes(colName);
        const primaryKey = isPrimaryKey ? ".primaryKey()" : "";

        schemaContent += `  ${colName}: ${drizzleType}${nullable}${primaryKey},\n`;
      }

      schemaContent += `});\n\n`;
    }

    // Get foreign keys
    const foreignKeys = await sql`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public';
    `;

    if (foreignKeys.length > 0) {
      schemaContent += `// Foreign key relationships:\n`;
      for (const fk of foreignKeys) {
        schemaContent += `// ${fk.table_name}.${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}\n`;
      }
    }

    writeFileSync(join(process.cwd(), "db", "schema.ts"), schemaContent);
    console.log("Schema pulled successfully!");
    console.log(`Found ${tables.length} tables`);
  } catch (error) {
    console.error("Error pulling schema:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

pullSchema();
