# VLOOKUP Feature Guide

## What is VLOOKUP?

VLOOKUP lets you match data between different sheets in your Excel file, similar to Excel's VLOOKUP function but with more flexibility.

## How to Use

### Step 1: Upload Your Excel File
Upload an Excel file that has multiple sheets with related data.

### Step 2: Select "VLOOKUP" Operation

### Step 3: Configure Source (Where to look up)
- **Lookup Sheet**: The sheet that has the values you want to find matches for
- **Lookup Column**: The column name in that sheet (e.g., "Customer ID", "Name")

### Step 4: Configure Target (Where to find matches)
- **Target Sheet**: The sheet that contains the matching data
- **Match Column**: The column to match against (e.g., "ID", "Customer")
- **Return Column**: The column whose value you want to retrieve (e.g., "Price", "Status", "Address")

### Step 5: Choose Match Type
- **Exact Match**: Values must match exactly
- **Contains**: Partial matching (useful for names or descriptions)
- **Regex Pattern**: Advanced pattern matching

### Step 6: Execute
Click "Execute VLOOKUP" and download the result. A new column will be added to your lookup sheet with the matched values.

## Example Use Case

**Scenario**: You have two sheets:
- **Orders** sheet with columns: OrderID, CustomerID, ProductName
- **Customers** sheet with columns: CustomerID, CustomerName, Email, Phone

**Goal**: Add customer phone numbers to the Orders sheet

**Configuration**:
- Lookup Sheet: Orders
- Lookup Column: CustomerID
- Target Sheet: Customers
- Match Column: CustomerID
- Return Column: Phone
- Match Type: Exact Match

**Result**: A new column "VLOOKUP_Phone" will be added to the Orders sheet with matching phone numbers!

## Tips
- Column names are case-sensitive
- Make sure column names are spelled correctly
- Use "Contains" for flexible text matching
- Use "Regex Pattern" for advanced matching (e.g., matching patterns)
