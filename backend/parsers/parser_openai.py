from pydantic_models import QuizSchema, CodingQuestionSchema
from quiz_metadata import compute_coding_metadata
import json


def openai_parser(response: dict) -> QuizSchema:
    """
    Parses the response from the OpenAI model into QuizSchema objects.
    It extracts quiz title, questions, options, and correct answers.

    Args:
        response (dict): The response dictionary from the OpenAI model.

    Returns:
        list[QuizSchema]: A list of QuizSchema objects extracted from the response.
    """
    content = response["choices"][0]["message"]["content"]

    # Attempt to parse the content as JSON
    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        print("JSON parsing failed: ", e)
        return {"Error": "Failed to parse JSON"}

    print("Parsed Quiz Data:", data)

    # Accept both 'quiz_title' and 'title' keys, fallback to a generated title if missing/empty
    quiz_title = data.get("quiz_title") or data.get("title")
    if (
        not quiz_title
        or not isinstance(quiz_title, str)
        or not quiz_title.strip()
        or quiz_title.strip().lower() == "untitled quiz"
    ):
        quiz_title = f"Quiz ({len(data.get('questions', []))} Questions)"

    questions = []

    # Iterate through each question and create QuizSchema objects. Push to list.
    for q in data["questions"]:
        questions.append(
            QuizSchema(
                title=quiz_title,
                question=q["question"],
                options=q["options"],
                correct_answer=q["answer"],
            )
        )
    return questions


def openai_coding_parser(response: dict) -> list[CodingQuestionSchema]:
    """
    Parses the response from the OpenAI model into CodingQuestionSchema objects.
    Extracts coding challenge questions from the AI response.

    Args:
        response (dict): The response dictionary from the OpenAI model.

    Returns:
        list[CodingQuestionSchema]: A list of coding question objects.
    """
    content = response["choices"][0]["message"]["content"]

    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        print("JSON parsing failed: ", e)
        return {"Error": "Failed to parse JSON"}

    print("Parsed Coding Quiz Data:", data)

    questions = []

    for q in data.get("questions", []):
        question = q["question"]
        starter_code = q.get("starter_code", "")
        test_cases = q.get("test_cases", [])
        computed = compute_coding_metadata(question, starter_code, test_cases)
        questions.append(
            CodingQuestionSchema(
                question=question,
                starter_code=starter_code,
                test_cases=test_cases,
                hints=q.get("hints", []),
                time_limit_ms=q.get("time_limit_ms", 1000),
                memory_limit_kb=q.get("memory_limit_kb", 65536),
                topic_tags=q.get("topic_tags", []),
                avg_cpu_time_ms=q.get("avg_cpu_time_ms", 0),
                avg_memory_kb=q.get("avg_memory_kb", 0),
                avg_code_lines=q.get("avg_code_lines", 0),
                **computed,
            )
        )
    return questions
