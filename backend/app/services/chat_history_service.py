import json
import os
from langchain_core.messages import HumanMessage, AIMessage

def save_chat(session_id, messages):

    path = os.path.join(
        "storage",
        session_id,
        "chat.json"
    )

    with open(
        path,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            messages,
            f,
            indent=4,
            ensure_ascii=False
        )


def load_chat(session_id):

    path = os.path.join(
        "storage",
        session_id,
        "chat.json"
    )

    if not os.path.exists(path):

        return []

    with open(
        path,
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)
    
    
def prepare_chat_history(chat_session):

    messages = []

    for msg in chat_session:

        if isinstance(msg, HumanMessage):

            messages.append({
                "role": "user",
                "content": msg.content
            })

        elif isinstance(msg, AIMessage):

            messages.append({
                "role": "assistant",
                "content": msg.content
            })

    return messages