FROM python:3.11-slim AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl ca-certificates gnupg \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && apt-get purge -y --auto-remove curl gnupg \
    && rm -rf /var/lib/apt/lists/*

RUN useradd --create-home --shell /bin/bash appuser

WORKDIR /app

COPY backend/requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY ml_models/difficulty_classifier/difficulty_model.pkl ./ml_models/difficulty_classifier/difficulty_model.pkl
COPY ml_models/difficulty_classifier/difficulty_predictor.py ./ml_models/difficulty_classifier/difficulty_predictor.py
COPY ml_models/tag_classifier/topic_model.pkl ./ml_models/tag_classifier/topic_model.pkl
COPY ml_models/tag_classifier/predict.py ./ml_models/tag_classifier/predict.py

RUN chown -R appuser:appuser /app
USER appuser

WORKDIR /app/backend

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
