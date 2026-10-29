import getpass
import oracledb
from pathlib import Path

password = getpass.getpass("Enter LEARNPATH database password: ")

connection = oracledb.connect(
    user="LEARNPATH",
    password=password,
    host="127.0.0.1",
    port=1521,
    service_name="FREEPDB1"
)

output_file = Path(__file__).resolve().parent / "learnpath_schema.sql"

try:
    cursor = connection.cursor()
    cursor.execute("""
        SELECT table_name
        FROM user_tables
        ORDER BY table_name
    """)
    table_names = [row[0] for row in cursor.fetchall()]

    if not table_names:
        raise RuntimeError("No tables found for the LEARNPATH user.")

    with output_file.open("w", encoding="utf-8") as file:
        file.write("-- LearnPath Oracle table definitions\n")
        file.write("-- Exported from the existing LEARNPATH schema\n\n")

        for table_name in table_names:
            cursor.execute("""
                SELECT DBMS_METADATA.GET_DDL('TABLE', :table_name, USER)
                FROM dual
            """, {"table_name": table_name})

            ddl = cursor.fetchone()[0].read()
            file.write(ddl.rstrip().rstrip(";") + ";\n\n")

    cursor.close()
    print(f"Exported {len(table_names)} table definitions.")
    print(f"File: {output_file}")

finally:
    connection.close()
