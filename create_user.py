
import getpass
import oracledb

admin_password = getpass.getpass("Enter Oracle SYSTEM password: ")

connection = oracledb.connect(
    user="SYSTEM",
    password=admin_password,
    host="127.0.0.1",
    port=1521,
    service_name="FREEPDB1"
)

cursor = connection.cursor()

try:
    cursor.execute("""
        CREATE USER LEARNPATH IDENTIFIED BY "LearnPath_App_2026!"
    """)

    cursor.execute("GRANT CREATE SESSION TO LEARNPATH")
    cursor.execute("GRANT CREATE TABLE TO LEARNPATH")
    cursor.execute("GRANT CREATE SEQUENCE TO LEARNPATH")

    connection.commit()
    print("LearnPath database user created successfully.")

except oracledb.DatabaseError as error:
    print("Database error:", error)

finally:
    cursor.close()
    connection.close()
