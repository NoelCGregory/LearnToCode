
import unittest
import Main

class MainTest(unittest.TestCase):
    
    def test_Case1(self):
        print('=========')
        try:
            self.assertEqual(Main.addVal(1,3), 4)
        except NameError:
            print(""+NameError)

    def test_Case2(self):
        print('=========')
        try:
            self.assertEqual(Main.addVal(1,3), 3)
        except NameError:
            print(""+NameError)

    def test_Case3(self):
        print('=========')
        try:
            self.assertEqual(Main.addVal(1,3), 3)
        except NameError:
            print(""+NameError)
    