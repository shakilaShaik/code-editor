# backend/main.py

from fastapi import FastAPI
from pydantic import BaseModel
import subprocess
import uuid
import os

app = FastAPI()

class CodeRequest(BaseModel):
    code: str
    user_input: str = ""

@app.post("/run")
def run_code(req: CodeRequest):
    file_name = f"/tmp/{uuid.uuid4()}.py"

    # Write user code to a temporary file
    with open(file_name, "w") as f:
        f.write(req.code)

    try:
        # Execute the code with user input
        result = subprocess.run(
            ["python3", file_name],
            input=req.user_input.encode(),
            capture_output=True,
            timeout=5
        )
        output = result.stdout.decode()
        error = result.stderr.decode()
    except subprocess.TimeoutExpired:
        output = ""
        error = "Error: Execution timed out."
    except Exception as e:
        output = ""
        error = f"Error: {str(e)}"
    finally:
        os.remove(file_name)

    return {"output": output, "error": error}
