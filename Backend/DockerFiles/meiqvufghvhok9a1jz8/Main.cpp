
    #include <iostream>
    using namespace std;int addVal(int a,int b) {
    int n = a+b;
    
    cout << n;
  noel
    
    return n;
} int main ()
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