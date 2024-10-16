knex = require('../database/knex');

const AppError = require('../utils/AppError');

class OrdersController {
    async create(request, response) {
        const { dishes, total_price, payment_method } = request.body;
        const userId = request.user.id;

        const dishes_id = dishes.map((dish) => dish.id);
        const quantities = dishes.map((dish) => dish.qty);

        console.log(dishes_id, quantities)

        // check if total price is bigger than 0
        if (total_price < 0) {
            throw new AppError('Total price must be a positive decimal number');
        }

        // check if all quantities are more than zero
        if (quantities.some((qty) => qty <= 0)) {
            throw new AppError('All quantities must be greater than zero');
        }

        // check if payment method is provided
        if (!payment_method) {
            throw new AppError('Payment method is required');
        } else if (payment_method !== 'credit_card' && payment_method !== 'pix' && payment_method !== 'cash') {
            throw new AppError('Invalid payment method');
        }

        // check if dishes array is given and not undefined
        if(dishes_id && !Array.isArray(dishes_id)) {
            throw new AppError('Dishes must be an array of integers');
        } else if (dishes_id) {       
            // check if dishes exists
            const dishes = await knex('Dishes').whereIn('id', dishes_id).select('id');
            if (dishes.length !== dishes_id.length) {
                throw new AppError('One or more dishes not found');
            }
        } else {
            throw new AppError('Dishes are required');
        }

        // insert values in Orders table
        const [ order_id ] = await knex('Orders').insert({
            user_id: userId,
            total_price,
            payment_method
        });

        // insert values in OrderDishes table
        const orderDishes = dishes_id.map((dish_id, index) => ({ order_id, dish_id, quantity: quantities[index] }));
        console.log(orderDishes)
        await knex('OrderDishes').insert(orderDishes);    

        // Send notification to customer

        // Send email to restaurant

        // Send push notification to delivery person

        return response.status(201).json();
    }

    async update(request, response) {
        const { id } = request.params;
        const { status } = request.body;
        const isAdmin = request.user.isAdmin;

        const order = await knex('Orders').where('id', id).first();

        if (!order) {
            throw new AppError('Order not found');
        }

        if (!isAdmin) {
            throw new AppError('You are not authorized to update this order');
        }

        if (status !== 'pending' && status !== 'preparing' && status !== 'delivered' && status !== 'canceled') {
            throw new AppError('Invalid status');
        }

        const updatedOrder = await knex('Orders').where('id', id).update({ status }).returning('*');

        return response.status(200).json(updatedOrder[0]);
    }

    async index(request, response) {
        const userId = request.user.id;    
        
        const orders = await knex('OrderDishes')
            .join('Dishes', 'OrderDishes.dish_id', '=', 'Dishes.id')
            .join('Orders', 'OrderDishes.order_id', '=', 'Orders.id')
            .select('Orders.*', 'Dishes.name', 'Dishes.price', 'OrderDishes.quantity')
            .groupBy('Orders.id', 'Dishes.id');

        const formattedOrders = orders.reduce((accumulator, order) => {
            const existingOrder = accumulator.find(o => o.id === order.id);
            if (existingOrder) {
                existingOrder.dishes.push({ name: order.name, price: order.price, quantity: order.quantity });
            } else {
                accumulator.push({ ...order, dishes: [{ name: order.name, price: order.price, quantity: order.quantity }] });
            }
            return accumulator;
        }, []);

        return response.json(formattedOrders);
    }

    async show(request, response) {
        const { id } = request.params;

        const order = await knex('Orders').where('id', id).first();

        if (!order) {
            throw new AppError('Order not found');
        }

        const dishes = await knex('OrderDishes')
            .join('Dishes', 'OrderDishes.dish_id', '=', 'Dishes.id')
            .where('OrderDishes.order_id', id)
            .select('Dishes.name', 'Dishes.price', 'OrderDishes.quantity');

        return response.json({ ...order, dishes });
    }
}

module.exports = OrdersController;