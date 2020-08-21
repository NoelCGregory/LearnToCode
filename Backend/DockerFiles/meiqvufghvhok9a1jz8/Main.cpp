
    #include <iostream>
    using namespace std; int main ()
        { 
      try {
        cout << "-||" << addVal(1,2) << "||-" ;
        cout << "%";
      }catch (const std::exception& e)
      {
         std::cout << e.what();
      }
      try {
        cout << "-||" << addVal(3,2) << "||-" ;
        cout << "%";
      }catch (const std::exception& e)
      {
         std::cout << e.what();
      }}