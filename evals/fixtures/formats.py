class Parser:
    supported = False

    def parse(self, text):
        if not self.supported:
            raise ValueError("unsupported format")
        return text


class CsvParser(Parser):
    supported = True

    def parse(self, text):
        return text.split(",")


REGISTRY = {"csv": CsvParser}


def parse(format_name, text):
    parser = REGISTRY.get(format_name, Parser)
    return parser().parse(text)
