import json
import os

def save_metadata(session_id, title, has_pdf=False):

    path = os.path.join(
        "storage",
        session_id,
        "metadata.json"
    )

    data = {
        "title": title,
        "has_pdf": has_pdf
    }

    with open(path, "w") as f:
        json.dump(data, f, indent=4)


def load_metadata(session_id):

    path = os.path.join(
        "storage",
        session_id,
        "metadata.json"
    )

    if not os.path.exists(path):

        return {
            "title":"New Chat",
            "has_pdf":False
        }

    with open(path) as f:
        return json.load(f)