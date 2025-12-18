#!/bin/bash
cd /home/kavia/workspace/code-generation/ai-test-automation-suite-7971-7980/frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

