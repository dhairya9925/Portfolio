
import sqlite3

def migrate():
    conn = sqlite3.connect('portfolio.db')
    cursor = conn.cursor()

    tables = ['technologies', 'projects', 'education']
    
    for table in tables:
        try:
            # Check if order column exists
            cursor.execute(f"PRAGMA table_info({table})")
            columns = [info[1] for info in cursor.fetchall()]
            
            if 'order' not in columns:
                print(f"Adding 'order' column to {table}...")
                cursor.execute(f'ALTER TABLE {table} ADD COLUMN "order" INTEGER DEFAULT 0')
            else:
                print(f"'order' column already exists in {table}.")
                
            # Specific check for education table issues
            if table == 'education' and 'school' not in columns:
                print(f"Adding 'school' column to {table} (weird case)...")
                cursor.execute(f'ALTER TABLE {table} ADD COLUMN school VARCHAR')

        except Exception as e:
            print(f"Error migrating {table}: {e}")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
