const sequelize = require('./databaseConnection');

// Get the models
const user = require('./models/user_model');
const category = require('./models/category_model');
const food = require('./models/food_model');
const order = require('./models/order_model');
const orderedFood = require('./models/ordered_food_model');
const payment = require('./models/payment');
const paymentMethod = require('./models/payment_method');
const role = require('./models/roles_model');

/**
 * Define the relationships
 */

// A role has many users but a user has only one role
role.hasMany(user, { foreignKey: 'role_id' });
user.belongsTo(role, { foreignKey: 'role_id' });

// A server can take many orders but an order is taken by a single server
user.hasMany(order, { foreignKey: 'waiter_id' });
order.belongsTo(user, { foreignKey: 'waiter_id' });

// A category can have many food items but each food item belongs to a specific category
category.hasMany(food, { foreignKey: 'category_id' });
food.belongsTo(category, { foreignKey: 'category_id' });

// An order can have many food items and a food item can have many orders
order.belongsToMany(food, { through: orderedFood, foreignKey: 'order_id' });
food.belongsToMany(order, { through: orderedFood, foreignKey: 'food_id' });

// An order has only one payment and each payment belongs to one order
order.hasOne(payment, { foreignKey: 'order_id' });
payment.belongsTo(order, { foreignKey: 'order_id' });

// Many payments can use the same method and each payment has one method
paymentMethod.hasMany(payment, { foreignKey: 'payment_method_id' });
payment.belongsTo(paymentMethod, { foreignKey: 'payment_method_id' });

// Drop existing tables and create new ones
sequelize
  .sync({ force: true, logging: false })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch(console.error);
