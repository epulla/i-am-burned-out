import unittest

from formats import parse


class ParseTests(unittest.TestCase):
    def test_csv(self):
        self.assertEqual(parse("csv", "a,b"), ["a", "b"])

    def test_unknown(self):
        with self.assertRaises(ValueError):
            parse("unknown", "text")
