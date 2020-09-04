
      import static org.junit.Assert.*;
      import static org.hamcrest.Matchers.*;	
      import org.junit.Test;		
      import org.junit.Before;
      import org.junit.After;
      public class MainTest {
          private program program;
          @Before
          public void setUp() {
            program = new program();
          }
           @Test
          public void testOnr() {
              int[] a = {12,12,12,2};
              int expectedResult = 36;
              System.out.println("|-|");
              try {
                 assertThat(program.add(a), is(expectedResult));
              } catch (Throwable  t) {
                 System.out.println("Error: "+t);
              }
          }
            @Test
          public void testsec() {
              int[] a = {12,12,12,2};
              int expectedResult = 38;
               System.out.println("|-|");
              try {
                 assertThat(program.add(a), is(expectedResult));
              } catch (Throwable  t) {
                  System.out.println("Error: "+t);
              }
          }
        @After
          public void tearDown() {
            System.out.println("%");
            program = null;
          }
      }