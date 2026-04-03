// Array to store all expenses
let expenses = [];

// DOM element references
const expenseInput = document.getElementById('expenseInput');
const addBtn = document.getElementById('addBtn');
const totalAmountDiv = document.getElementById('totalAmount');
const expenseListUl = document.getElementById('expenseList');

// Helper function to remove error border
function removeErrorBorder() {
    expenseInput.classList.remove('error-border');
    expenseInput.classList.remove('success-border');
}

// Helper function to add error border
function addErrorBorder() {
    expenseInput.classList.add('error-border');
}

// Helper function to add success border
function addSuccessBorder() {
    expenseInput.classList.add('success-border');
    setTimeout(() => {
        expenseInput.classList.remove('success-border');
    }, 1000);
}

// Function 1: Calculate total using reduce() method
function calculateTotal() {
    if (expenses.length === 0) {
        return 0;
    }

    // Using reduce() method to calculate total expense
    const total = expenses.reduce((accumulator, currentExpense) => {
        return accumulator + currentExpense.amount;
    }, 0);

    return total;
}

// Function 2: Update total expense display in DOM
function updateTotalDisplay() {
    const total = calculateTotal();
    totalAmountDiv.textContent = total.toFixed(2) + ' টাকা';
}

// Function 3: Display all expenses in the DOM list
function updateExpenseList() {
    // Clear existing list
    expenseListUl.innerHTML = '';

    if (expenses.length === 0) {
        // Show empty message when no expenses
        const emptyMsg = document.createElement('li');
        emptyMsg.className = 'empty-msg';
        emptyMsg.textContent = 'কোনো খরচ যোগ করা হয়নি';
        expenseListUl.appendChild(emptyMsg);
        return;
    }

    // Create list item for each expense
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');

        // Expense description span
        const expenseText = document.createElement('span');
        expenseText.textContent = `${expense.id}. ${expense.amount.toFixed(2)} টাকা`;

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'মুছুন';
        deleteBtn.className = 'delete-btn';

        // Add click event to delete this expense
        deleteBtn.addEventListener('click', () => {
            deleteExpense(index);
        });

        li.appendChild(expenseText);
        li.appendChild(deleteBtn);
        expenseListUl.appendChild(li);
    });
}

// Function 4: Delete a specific expense by index
function deleteExpense(index) {
    expenses.splice(index, 1);

    // Reassign IDs after deletion
    expenses.forEach((expense, idx) => {
        expense.id = idx + 1;
    });

    updateAll();
}

// Function 5: Update everything at once
function updateAll() {
    updateTotalDisplay();
    updateExpenseList();
}

// Function 6: Check if the input contains only valid number format
function isValidNumber(str) {
    if (str === '') return false;
    // Regular expression to check valid number format
    // Allows: 500, 1000.50, 0.99
    // Does NOT allow: abc, 12abc, abc12, 12.34.56
    const numberRegex = /^\d+(\.\d+)?$/;
    return numberRegex.test(str);
}

// Function 7: Add new expense with validation (ALERT on text input)
function addExpense() {
    // Remove error border
    removeErrorBorder();

    // Get input value and trim whitespace
    let inputValue = expenseInput.value.trim();

    // VALIDATION 1: Check if input is empty
    if (inputValue === '') {
        alert('সতর্কতা: দয়া করে টাকার পরিমাণ লিখুন! ইনপুট বক্স খালি রাখা যাবে না।');
        addErrorBorder();
        expenseInput.focus();
        return false;
    }

    // VALIDATION 2: Check if input contains any letters (a-z or A-Z)
    const hasLetters = /[a-zA-Z]/g.test(inputValue);
    if (hasLetters) {
        alert(`সতর্কতা: টেক্সট লেখা যাবে না! দয়া করে শুধুমাত্র সংখ্যা লিখুন।
                
আপনি লিখেছেন: "${inputValue}"
এই ইনপুটে অক্ষর (A-Z, a-z) আছে।

সঠিক উদাহরণ: 500, 1000.50, 75.25`);
        addErrorBorder();
        expenseInput.value = ''; // Clear the invalid input
        expenseInput.focus();
        return false;
    }

    // VALIDATION 3: Check if input contains only numbers and decimal
    if (!isValidNumber(inputValue)) {
        alert(`সতর্কতা: "${inputValue}" একটি সঠিক সংখ্যা নয়!
                
শুধুমাত্র সংখ্যা এবং একটি দশমিক বিন্দু ব্যবহার করুন।
সঠিক উদাহরণ: 500, 1000.50, 75.25
ভুল উদাহরণ: 12.34.56, 500abc`);
        addErrorBorder();
        expenseInput.value = '';
        expenseInput.focus();
        return false;
    }

    // Convert to number
    const amount = parseFloat(inputValue);

    // VALIDATION 4: Check if number is valid (not NaN)
    if (isNaN(amount)) {
        alert('সতর্কতা: এটি একটি সঠিক সংখ্যা নয়! দয়া করে সংখ্যা লিখুন।');
        addErrorBorder();
        expenseInput.value = '';
        expenseInput.focus();
        return false;
    }

    // VALIDATION 5: Check for negative or zero
    if (amount <= 0) {
        alert('সতর্কতা: দয়া করে ০ (শূন্য) এর চেয়ে বড় সংখ্যা লিখুন! খরচের পরিমাণ অবশ্যই ধনাত্মক হতে হবে।');
        addErrorBorder();
        expenseInput.value = '';
        expenseInput.focus();
        return false;
    }

    // VALIDATION 6: Check for multiple decimal points
    const decimalCount = (inputValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
        alert('সতর্কতা: দশমিক বিন্দু (.) একবারের বেশি ব্যবহার করা যাবে না!');
        addErrorBorder();
        expenseInput.value = '';
        expenseInput.focus();
        return false;
    }

    // All validations passed - add to array
    const newExpense = {
        id: expenses.length + 1,
        amount: amount
    };

    expenses.push(newExpense);

    // Clear input field
    expenseInput.value = '';

    // Show success feedback
    addSuccessBorder();

    // Update everything
    updateAll();

    // Success message
    console.log(`✅ ${amount} টাকা সফলভাবে যোগ করা হয়েছে`);

    return true;
}

// Add button click event listener
addBtn.addEventListener('click', addExpense);

// Enter key press support - also adds expense
expenseInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addExpense();
    }
});

// Remove error border when user starts typing
expenseInput.addEventListener('input', function () {
    removeErrorBorder();
});

// Initialize empty list on page load
updateAll();

// Console log showing reduce() method usage
console.log('খরচের ক্যালকুলেটর প্রস্তুত!');
console.log('reduce() মেথড ব্যবহার করে মোট খরচ বের করা হচ্ছে');
console.log('ভ্যালিডেশন: টেক্সট লিখলে Add বাটনে ক্লিক করলে alert দেখাবে');
console.log('ইউজার টাইপ করার সময় letter লিখতে পারবে, কিন্তু সাবমিট করলে alert পাবে');