
import oracledb
import getpass

password = getpass.getpass("Enter your Oracle SYSTEM password: ")

try:
    connection = oracledb.connect(
        user="SYSTEM",
        password=password,
        host="127.0.0.1",
        port=1521,
        service_name="FREEPDB1"
    )

    print("SUCCESS: Connected to Oracle Database!")

    cursor = connection.cursor()
    cursor.execute("SELECT name FROM v$database")
    print("Database:", cursor.fetchone()[0])

    cursor.close()
    connection.close()

except oracledb.Error as error:
    print("Connection failed:", error)
