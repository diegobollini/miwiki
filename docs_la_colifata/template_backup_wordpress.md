---
layout: page
title: Bash script - Backup WP + SQL & Descarga
# permalink: /creative_code/
parent: La Colifata
---

```bash
#!/bin/bash

# Datos de conexión SSH

SSH_USER="user_name"
SSH_HOST="104.123.456.789"
SSH_PORT="XX"
SSH_KEY="~/.ssh/private_key_diego"

# Rutas en el servidor

DB_NAME="db_name"
DB_USER="db_user"
DB_PASSWORD="db_password"
SITE_PATH="/var/www/lacolifata"
BACKUP_DIR="/tmp/backup"

# Ruta local donde guardarás el respaldo

LOCAL_BACKUP_DIR="/home/diego/proyectos"

# Nombre del archivo de respaldo

BACKUP_FILENAME="respaldo_${DB_NAME}_$(date +'%Y%m%d_%H%M%S').tar.gz"

echo "Iniciando respaldo..."

# Acceder al servidor SSH y realizar el respaldo

# GRANT PROCESS ON _._ TO 'lacolifatadbuser'@'localhost';

ssh -i "$SSH_KEY" -T -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" <<EOF
echo "Haciendo dump de la base de datos..."
mkdir -p "$BACKUP_DIR"
mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_DIR/$DB_NAME.sql"

echo "Copiando el sitio web..."
cp -r $SITE_PATH $BACKUP_DIR/

echo "Comprimiendo todo..."
tar -czvf $BACKUP_DIR/$BACKUP_FILENAME -C $BACKUP_DIR .

echo "Respaldo completado en el servidor."
exit
EOF

# Descargar el archivo de respaldo localmente

echo "Descargando el archivo de respaldo..."
scp -i "$SSH_KEY" -P "$SSH_PORT" "$SSH_USER@$SSH_HOST:$BACKUP_DIR/$BACKUP_FILENAME" "$LOCAL_BACKUP_DIR"

# Eliminar el archivo de respaldo en el servidor (opcional)

ssh -i "$SSH_KEY" -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "rm -rf $BACKUP_DIR"

# Notificar la finalización

echo "Respaldo completado y descargado en $LOCAL_BACKUP_DIR/$BACKUP_FILENAME"
```
