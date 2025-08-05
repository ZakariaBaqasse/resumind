from langfuse import Langfuse
from langfuse.langchain import CallbackHandler

# Initialize Langfuse
langfuse = Langfuse()
langfuse_callback_handler = CallbackHandler()


# Optional, verify that Langfuse is configured correctly
assert langfuse.auth_check()
