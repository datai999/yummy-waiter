**User Interface Design for Waiters take order at a Pho Restaurant**

Design a modern mobile website interface for waiters at a pho restaurant to streamline the order-taking process. 

**Features:**

1. **Table Selection**: Text: "Yummy Pho 2". The waiter can select the table number from a dropdown menu.
  
2. **Menu Categories**: The main menu will be fixed at the top and will include the following categories:
   - Beef
   - Chicken
   - Drinks (e.g., water, ice water, hot water)
   - Side Orders (e.g., Egg york, rib bone, extra noodle)
   - Dessert (e.g., tofu regular, tofu matcha, tofu)

3. **Scrolling and Swiping**: When a category is clicked, the window will scroll to the top. The waiter can also swipe left or right to navigate between categories.

4. **Customization for Main Dishes**:  
All options must be displayed in the base UI; do not use pop-ups.  
- When selecting either beef or chicken, the waiter must choose:  
  - Types of meat: a grid of buttons will be displayed, highlighted when selected; multiple selections are allowed.  
  - Types of noodles: (e.g., Thin rice noodles, Thick rice noodles) 
  - Custom preferences (e.g., less-noodle, onion): a grid of buttons will be displayed, highlighted when selected; multiple selections are allowed. 
   - The waiter can also note any specials for the dish.

5. **Select Drinks, Side Orders, and Desserts**: A grid of buttons will be displayed for your selections.

6. **Order List View**: After making your selections, items will be added to a list view displayed at the bottom of the screen. The items in the list are sorted by category, with clear dividers between categories. There are two separate list views: one for Food, which includes categories such as Beef, Chicken, and Side Orders, and another for Drinks & Dessert, which shows only the items added from those specific categories.

7. **Highlighting Selected Items**: When an item in the list view is clicked, it will be highlighted, and the specific category and attributes of that selected item will be opened.

8. **Placing Orders**: At the bottom of the interface, there will be a "Place Order" button. Clicking this button will open a confirmation popup to finalize the order.


**User Interface Design for Waiters select table at a Pho Restaurant**

To create a card interface used on the mobile web restaurant tables numbered from 1 to 20 for waitstaff, follow these guidelines:

**Features:**

1. **Card Layout**:
   - Each table is represented as a card.
   - Display the table number prominently on each card (e.g., "Table 1," "Table 2," ..., "Table 21").
   - Include a timer indicating how long it has been since the order was taken for each table.

2. **Color Change**:
   - Set a default color for the cards (e.g., light gray).
   - Change the card color to indicate activity: use green for "has order" and red for "needs attention."

3. **Tap to View Order**:
   - Make the entire card tappable. When tapped, it should display the full details of the order for that table (e.g., items ordered, customer notes, etc.).

4. **Move Order to History**:
   - Include a button on the card labeled "Move to History."
   - When clicked, this button should archive the order and update the table's status to "available."

5. **Overall Interaction**:
   - Ensure a smooth user experience so that waitstaff can quickly view and manage orders without unnecessary delays.

6. **Oldest Table**:
   - Implement a horizontal swipe feature to view the history of tables at the bottom.
   - Sort the order history by the time the order was taken.

7. **Order History**:
   - Allow swiping across the horizontal order history at the bottom.
   - Sort the orders with the most recent first.

This concept will help streamline operations for waitstaff and enhance efficiency in managing orders at the restaurant.