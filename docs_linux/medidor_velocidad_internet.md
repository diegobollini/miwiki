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
