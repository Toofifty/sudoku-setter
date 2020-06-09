# Sudoku Setter

A tool to help people set advanced Sudoku puzzles. Doubles as a Sudoku solver :)

### TODO

Solvers

-   [x] Naked singles
-   [x] Narrow cell (only in X)
-   [x] Pairs
    -   [x] Exclusive (others can't be in the group)
    -   [x] Inclusive (x numbers must be in the group)
-   [x] Restricted in box (i.e. Pencilled in column/row in another box)
-   [ ] Triples (exclusive/inclusive)
-   [ ] X wing
-   [ ] Y wing

Extra restrictions

-   [ ] Sandwich
-   [ ] Chess moves (King, Knight)
-   [ ] Thermos
-   [ ] Killer boxes
-   [ ] Diagonals
-   [ ] Comparators

### Scenarios

Pair tester http://localhost:3001/#{%22givens%22:%22000005010200790500006001000000000630705602904034000000000300700002074009090100000%22}

-   5/6 "exclusive" row pair in r8 c2/8 - puts 8 into r8 c4
-   2/7 "inclusive" box pair in r1/3 c9
-   3/8 "inclusive" row/box pair in r9 c7/9

Narrow cell after pair http://localhost:3001/#{%22givens%22:%22000792008000860105000300000000000070702080309040000000000008200608071000200639000%22}

-   4/5 pair in r7 c4/5 - forces 4 into r9 c3
