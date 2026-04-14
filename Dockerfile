# ── 1단계: 빌드 ──────────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# 시스템 의존성 (빌드용)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# CPU 전용 torch (CUDA 제거 → ~1.5GB 절약)
RUN pip install --upgrade pip && \
    pip install --user --no-cache-dir \
    torch torchvision --index-url https://download.pytorch.org/whl/cpu && \
    pip install --user --no-cache-dir -r requirements.txt

# ── 2단계: 런타임 ─────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# 런타임 시스템 의존성만
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 빌드 스테이지에서 설치된 패키지만 복사
COPY --from=builder /root/.local /root/.local

# 소스 코드 복사
COPY src/ ./src/

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["sh", "-c", "uvicorn src.api.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
