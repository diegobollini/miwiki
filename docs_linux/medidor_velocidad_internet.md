---
layout: page
title: Speedtest script
# permalink: /discos_trascendentales/
parent: Linux
---

```python
import speedtest
import json
import time
import socket

st = speedtest.Speedtest()

def medir_velocidad():
descarga = st.download() / 1_000_000
subida = st.upload() / 1_000_000
return {"descarga": descarga, "subida": subida}

while True:
resultado = medir_velocidad()
best_server = st.get_best_server()
datos = {
"fecha": time.strftime("%Y-%m-%d"),
"hora": time.strftime("%H:%M:%S"),
"descarga": resultado["descarga"],
"subida": resultado["subida"], # "ip": socket.gethostbyname(best_server["host"]),
"proveedor": best_server["sponsor"],
}
with open("registro.json", "a") as archivo:
json.dump(datos, archivo)
archivo.write("\n")
print("Velocidad medida: ", datos)
time.sleep(60) # espera 1 minuto antes de volver a medir la velocidad
```

# Internet Speed tester

```python
# Instalar dependencia
# $ pip install speedtest-cli
import speedtest as st

# Set Best Server
server = st.Speedtest()
server.get_best_server()

# Test Download Speed
down = server.download()
down = down / 1000000
print(f"Download Speed: {down} Mb/s")

# Test Upload Speed
up = server.upload()
up = up / 1000000
print(f"Upload Speed: {up} Mb/s")

# Test Ping
ping = server.results.ping
print(f"Ping Speed: {ping}")
```

## Automatizar ejecución

Para ejecutar el script automáticamente al iniciar Ubuntu 22, puedes utilizar el administrador de servicios de systemd. Sigue los siguientes pasos:

- Abre tu editor de texto favorito y crea un archivo llamado medidor_de_velocidad.service en la carpeta /etc/systemd/system/. - Puedes utilizar el comando sudo nano /etc/systemd/system/medidor_de_velocidad.service para crear y abrir el archivo con el editor de texto Nano.
- Agrega el siguiente contenido al archivo medidor_de_velocidad.service:

```conf
[Unit]
Description=Medidor de velocidad de internet
After=network.target

[Service]
Type=simple
User=<tu_usuario>
WorkingDirectory=<ruta_a_la_carpeta_del_script>
ExecStart=/usr/bin/python3 <ruta_al_script>/medidor_de_velocidad.py
Restart=always

[Install]
WantedBy=multi-user.target
```

- Asegúrate de reemplazar <tu_usuario> con tu nombre de usuario en Ubuntu, y <ruta_a_la_carpeta_del_script> y <ruta_al_script> con las rutas a la carpeta donde se encuentra el script medidor_de_velocidad.py.
- Guarda el archivo y cierra el editor de texto.
- Activa el servicio ejecutando `sudo systemctl enable medidor_de_velocidad.service`
- Esto configurará el servicio para que se inicie automáticamente en cada inicio del sistema.
- Inicia el servicio ejecutando `sudo systemctl start medidor_de_velocidad.service`
