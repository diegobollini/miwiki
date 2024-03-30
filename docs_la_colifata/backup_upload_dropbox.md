---
layout: page
title: Script - Upload a Dropbox
# permalink: /creative_code/
parent: La Colifata
---

```python
# Dropbox app: https://www.dropbox.com/developers/apps
## replace all {fields} with your credentials and paths

import dropbox
import os
import requests

# Request URL
url = "https://api.dropbox.com/oauth2/token"

# Request Body
data = {
    "grant_type": "refresh_token",
    "refresh_token": "{your_refresh_token}",
}

# Request Headers
headers = {"User-Agent": "MyApp/1.0"}

# Request Auth
auth = ("{app_key}", "{app_secret}")

# Send POST request
response = requests.post(url, data=data, headers=headers, auth=auth)

# Save the response JSON
response_json = response.json()

# Get the access_token value
access_token = response_json.get("access_token")

# Initialize Dropbox client
dbx = dropbox.Dropbox(access_token)

# The local folder containing the files to be uploaded
local_folder = "{backup_dir}"

# The destination folder in the Dropbox account
dropbox_folder = "{dropbox_dir}"

# List all files in the destination folder
results = dbx.files_list_folder(dropbox_folder).entries

# Create a list of files names
destination_files = [entry.name for entry in results]

# Iterate through all files in the local folder
for file_name in os.listdir(local_folder):
    # Check if the file already exists in the destination folder
    if file_name not in destination_files:
        # Construct the full file path
        local_file_path = os.path.join(local_folder, file_name)
        dropbox_file_path = os.path.join(dropbox_folder, file_name)
        # Open file
        with open(local_file_path, "rb") as file:
            # Upload file
            dbx.files_upload(file.read(), dropbox_file_path)
            print(f"{file_name} was uploaded")
    else:
        print(f"{file_name} already exists in the destination folder")

# Keep only the last 20 files in the destination folder
if len(destination_files) >= 20:
    files_to_delete = destination_files[:-20]
    for file_to_delete in files_to_delete:
        file_path = os.path.join(dropbox_folder, file_to_delete)
        dbx.files_delete(file_path)
        print(f"{file_to_delete} was deleted")
```
