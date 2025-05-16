from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess
import uuid
import os

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    code: str
    user_input: str = ""

@app.post("/run")
def run_code(req: CodeRequest):
    file_name = f"/tmp/{uuid.uuid4()}.py"

    with open(file_name, "w") as f:
        f.write(req.code)

    try:
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
