import random
import string
import argparse
import yaml
import datetime

parser = argparse.ArgumentParser(
    prog="generate-test-files",
    description="Generates large numbers of Markdown files for testing.",
)

parser.add_argument("output", help="Output folder for generated Markdown files.")
parser.add_argument(
    "-n",
    "--numfiles",
    type=int,
    required=True,
    help="Number of files to generate.",
)

args = parser.parse_args()


def random_text():
    letters = string.ascii_letters
    return "".join(random.choice(letters) for i in range(10))


def random_check():
    return bool(random.getrandbits(1))


def random_date():
    start_date = datetime.date(2022, 1, 1)
    end_date = datetime.date(2023, 1, 1)

    time_between_dates = end_date - start_date
    days_between_dates = time_between_dates.days
    random_number_of_days = random.randrange(days_between_dates)
    random_date = start_date + datetime.timedelta(days=random_number_of_days)

    return random_date


def random_status():
    return random.choice(["Backlog", "In progress", "Done"])


def random_number():
    return random.randrange(1, 100)


for n in range(args.numfiles):
    path = args.output + "/" + random_text() + ".md"

    with open(path, "w") as file:
        frontmatter = {
            "status": random_status(),
            "published": random_check(),
            "due": random_date(),
            "weight": random_number(),
        }

        file.write("---\n")
        yaml.dump(frontmatter, file, encoding="utf-8")
        file.write("---\n\n")

        file.write("# " + random_text())
