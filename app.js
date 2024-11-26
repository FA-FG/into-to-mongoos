require('dotenv').config()

const mongoose = require('mongoose')
const prompt = require('prompt-sync')()

const Customer = require('./module/customer')

const connect = async () => {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to MongoDB')
  main()
}

const disconnect = async () => {
  await mongoose.disconnect()
  console.log('Disconnected from MongoDB')
  process.exit()
}

const username = prompt('What is your name? ')
console.log(`Your name is ${username}`)

const create = async () => {
  const cusName = prompt('Customer name: ')
  let age = parseInt(prompt('Customer age: '))

  if (isNaN(age)) {
    console.log('Please enter a valid number for age.')
    age = parseInt(prompt('Customer age: '))
  }
  const cusData = {
    name: cusName,
    age: age
  }
  const customer = await Customer.create(cusData)
  await view()
}

const view = async () => {
  const customer = await Customer.find({})
  customer.forEach((customer) => {
    console.log(
      `id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`
    )
  })
  console.log('\n')
}

const updateCus = async () => {
  await view()
  const updateId = prompt('Input the ID of the customer you want to update: ')

  const customer = await Customer.findById(updateId)
  if (!customer) {
    console.log('Customer not found.')
    return
  }
  const updatedName = prompt('Input upadated name: ')
  let updatedAge = parseInt(prompt('Input updated age: '))

  while (isNaN(updatedAge)) {
    console.log('Please enter a valid number for age.')
    updatedAge = parseInt(prompt('Input updated age: '))
  }

  const updateData = { name: updatedName, age: updatedAge }
  await Customer.findByIdAndUpdate(updateId, updateData, { new: true })
  await view()
}

const deleteCus = async () => {
  await view()
  const delId = prompt('Input the ID of the customer you want to delete: ')
  const customer = await Customer.findByIdAndDelete(delId)

  if (customer) {
    console.log(`Customer with ID: ${delId} has been deleted.`)
  } else {
    console.log('Customer not found.')
  }
  await view()
}

const main = async () => {
  console.log(
    '\nWelcome to the CRM \n\nWhat would you like to do? \n\n   1. Create a customer \n   2. View all customers \n   3. Update a customer \n   4. Delete a customer \n   5. quit\n'
  )
  const userChoice = prompt('Number of action to run: ')

  if (![1, 2, 3, 4, 5].includes(parseInt(userChoice))) {
    console.log('Invalid choice. Please choose a number between 1 and 5.')
    return main()
  }

  if (userChoice == 1) {
    await create()
  } else if (userChoice == 2) {
    await view()
  } else if (userChoice == 3) {
    await updateCus()
  } else if (userChoice == 4) {
    await deleteCus()
  } else if (userChoice == 5) {
    await disconnect()
    return
  }
  main()
}

connect()
