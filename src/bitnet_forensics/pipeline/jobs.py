"""Pipeline job orchestration."""

from bitnet_forensics.config.agentic_settings import AgenticSettings
from bitnet_forensics.pipeline.checkpointing import create_checkpointer
from bitnet_forensics.pipeline.runtime import WorkflowRuntime


def run_daily_ingestion() -> str:
    settings = AgenticSettings()
    runtime = WorkflowRuntime(
        nodes=[
            ("extract_transactions", lambda state: {"transactions_extracted": True}),
            ("normalize_features", lambda state: {"features_normalized": True}),
        ],
        checkpointer=create_checkpointer(settings),
        settings=settings,
    )
    result = runtime.run(initial_state={"job": "daily_ingestion"})
    return "ingestion-complete" if result.state.get("features_normalized") else "ingestion-failed"
