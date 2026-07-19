from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sys
import io
import contextlib
import traceback

app = FastAPI()

class ExecutionRequest(BaseModel):
    code: str
    test_code: str

@app.post("/execute")
def execute_code(req: ExecutionRequest):
    # Capture stdout and stderr
    stdout_capture = io.StringIO()
    stderr_capture = io.StringIO()
    
    full_code = f"{req.code}\n\n{req.test_code}"
    
    success = False
    try:
        with contextlib.redirect_stdout(stdout_capture), contextlib.redirect_stderr(stderr_capture):
            # create a new dictionary to serve as the local/global scope
            exec_globals = {}
            exec(full_code, exec_globals)
            success = True
    except Exception as e:
        stderr_capture.write(traceback.format_exc())
    
    return {
        "success": success,
        "stdout": stdout_capture.getvalue(),
        "stderr": stderr_capture.getvalue()
    }
