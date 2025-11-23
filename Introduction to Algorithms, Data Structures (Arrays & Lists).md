# Introduction to Algorithms, Data Structures (Arrays & Lists)

The following notes draw directly from the provided sources and comprehensively detail the core concepts of algorithm analysis and the fundamental data structures of arrays and lists.

## I. Introduction to Algorithms

### Algorithm Definition and Analysis

An algorithm is formally defined as a **sequence of definite and effective instructions**, which terminates and produces correct output from a given input. In essence, it is a formal representation of predefined instructions that a computer can perform. A coded algorithm, in a specific computer language, is called a program.

The overall goal of the field known as **Analysis of Algorithms** is to understand the complexity of algorithms. The analysis involves determining the amount of **resources** (such as time and storage) that are utilized by to execute. The focus has shifted from the computer itself to computer programming and then to the creation of an algorithm.

Key characteristics an algorithm should possess are:
1. Input
2. Output
3. Definiteness
4. Effectiveness
5. Termination

### Complexity and Measurement

Complexity theory deals with the resources required during computation, primarily time (how many steps (time) does it take to solve a problem) and space (how much memory does it take to solve a problem).

There are two important attributes to analyse an algorithm:
1. **Performance:** The actual time/memory/disk/network bandwidth is actually used when a program is run. This depends on factors like the algorithm, machine, compiler, etc..
2. **Complexity:** How do the resource requirements of a program or algorithm **scale** (the growth of resource requirements as a function of input). This describes the inherent complexity and is independent of machine/compiler considerations.

**Space complexity** is the amount of storage space required by an algorithm. It is considered **more critical** than run time complexity because if an algorithm demands memory beyond the capacity of the machine, the program will not execute at all. Space required, unlike time, can be reused during the execution of the program.

**Time complexity** is the maximum time required by a Turing machine to execute on any input of length $n$.

### Asymptotic Analysis and Notation

To describe complexity independently of specific hardware or implementation factors, **asymptotic analysis** is used. This technique estimates the complexity function for reasonably large length of input ‘n’ and concentrates on a "proportionality" approach.

The primary asymptotic notations are:

*   **Big O notation ($O$) (Upper Bound):** This provides an **upper bound** for a function to within a constant factor. It is often used to describe the **worst case running time** of algorithms. Mathematically, $O(g(n)) = \{f(n) : \text{There exists a positive constant } c \text{ and } n_0 \text{ such that } 0 \le f(n) \le c \cdot g(n) \text{ for all } n \ge n_0 \}$.
*   **Omega notation ($\Omega$) (Lower Bound):** This notation gives a **lower bound** for a function to within a constant factor. It is used to bound the **best case running time** of an algorithm.
*   **Theta notation ($\Theta$) (Tight Bound):** This notation bounds a function to within constant factors. We say $f(n) = \Theta(g(n))$ if there exist positive constants $n_0, c_1$ and $c_2$ such that to the right of $n_0$ the value of $f(n)$ always lies between $c_1 g(n)$ and $c_2 g(n)$, both inclusive.

Algorithms are categorized based on their complexity growth patterns, including:
*   $O(1)$: Constant growth (e.g., array access $A[i]$).
*   $O(\log n)$: Logarithmic growth (e.g., Binary search).
*   $O(n)$: Linear growth (e.g., Looping over $n$ elements).
*   $O(n \log n)$: $n \log n$ growth (e.g., Merge sort).
*   $O(n^k)$: Polynomial growth (e.g., $O(n^2)$ for selection sort worst case).
*   $O(2^n)$: Exponential growth (the most-danger growth pattern in computer science).

The complexity of algorithms can vary based on input configuration:
*   **Worst Case:** An upper bound for running time with any input.
*   **Best Case:** Guarantees that under any circumstances the running time of algorithms will at least take this much time.
*   **Average Case:** The average running time of algorithm over all problem instances for a given size.

For example, the exact analysis of **insertion sort** reveals a best-case time complexity of **$O(n)$** (when the list is already sorted) and a worst-case time complexity of **$O(n^2)$** (when the list is sorted in reverse order). The Average case running time lies between the best and the worst case.

## II. Data Structures: Arrays

### Definition and Characteristics
An array is a data structure defined as a **finite ordered set of homogeneous elements**, which is stored in **contiguous memory locations**. Homogeneous means all elements must be of the same data type.

*   The lower bound of an array index in C is always 0.
*   The total memory required for the array is computed as: `size of (data type) X length of array`.
*   **Multidimensional arrays** are defined with a separate pair of square brackets required for each subscript.
*   Arrays and pointers are closely related; an array name without an index is a pointer to the first element in the array.

### Storage Representation
The elements of an array are stored in sequence. The two methods of representation are:
1.  **Row Major Representation:** The first row of the array occupies the first set of the memory location reserved for the array, the second row occupies the next set, and so forth.
2.  **Column Major Representation:** The first column of the array occupies the first set of the memory locations reserved for the array, followed by the second column, and so forth.

### Applications of Arrays
Arrays are reliable to use when the number of items to be solved is fixed. They are used in situations where the size of the array can be established beforehand and where **insertions and deletions are minimal**, because these operations cause reshuffling and increase time complexity.

Specific array applications include:
*   **Sparse Matrices:** Matrices with a large number of zero entries. They are efficiently stored using the **3-tuple form**. The first row specifies the total number of rows, number of columns, and number of non zero elements in the matrix. Subsequent rows list the row number, column number, and value of each non zero element.
*   **Polynomials:** Polynomials (e.g., $5x^4 + 2x^3 + 7x^2 + 10x – 8$) can be represented using arrays where each element stores the coefficient and the exponent of a term.

## III. Data Structures: Lists

### Abstract Data Type (ADT) List
An ADT List is a **finite sequence of elements** of type T, along with operations such as create, update, delete, testing for empty, testing for full, finding the size, and traversing the elements. ADT definition focuses on the logical properties, not implementation details or efficiency.

Lists can be implemented in two ways:
1.  **Contiguous (Array) Implementation:** Entries are stored next to each other within an array. Insertion and deletion involve rewriting (shifting) all subsequent elements, making array implementation time-consuming and inefficient.
2.  **Linked (Pointer) Implementation:** Uses pointers and dynamic memory allocation.

### Linked Lists

A linked list is a chain of structures in which each structure (or node) consists of data as well as pointer (link), which stores the address of the next logical structure in the list. In a singly linked list, the first element is pointed to by the "head", and the last node points to **NULL**.

**Advantages and Disadvantages of Lists Compared to Arrays**:
*   **Advantage (Flexibility):** Overflow is not a problem until the computer memory is exhausted. Changes in list, such as insertion and deletion, can be made in the middle of the list **more quickly** than in contiguous lists.
*   **Disadvantage (Overhead):** The links themselves take space which is in addition to the space that may be needed for data.
*   **Disadvantage (Access):** Lists are **not suited for random access**; reaching a desired node requires traversing a long path.

### Types of Linked Lists

1.  **Singly Linked Lists:** Each element contains a pointer only to the next element.
2.  **Doubly Linked Lists:** Each element consists of three fields: a data field, a pointer to the right element, and a pointer to the left element. This structure enables traversing the list in both directions to improve performance. The leftmost and rightmost links are set to NULL.
3.  **Circularly Linked Lists:** The last element points to the first element, and the chain does not contain a NULL pointer to mark the end.

### List Applications
Lists are used to maintain **Polynomials** in the memory, where the list structures store the coefficient and exponent of each term.
