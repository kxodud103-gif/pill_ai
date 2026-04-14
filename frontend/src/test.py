import oracledb

conn = oracledb.connect(
    user="medi",
    password="1234",
    dsn="192.168.123.100:1521/XEPDB1"
)

print("연결 성공")

cursor = conn.cursor()
cursor.execute("SELECT * FROM users")

for row in cursor:
    print(row)

cursor.close()
conn.close()