import jwt from 'jsonwebtoken'
import User from '../models/User'
import bcrypt from 'bcryptjs'
import Item from '../models/Item'

exports.getUser = async _id => {
  try {
    const user = await User.findById(_id).populate('items')
    return user
  } catch (error) {
    throw new Error('Error on userServices.getUser')
  }
}

exports.getUserByEmail = async email => {
  try {
    const user = await User.findOne({ email: email })
    return user
  } catch (e) {
    throw Error('Error on userServices.getUserByEmail - ' + e)
  }
}

exports.getUsers = async () => {
  try {
    const users = await User.find()
    return users
  } catch (error) {
    throw new Error('Error on userServices.getUsers.')
  }
}

exports.createUser = async input => {
  try {
    const hashedPassword = await bcrypt.hash(input.password, 10)
    const email = input.email

    const newUser = new User({ email: email, password: hashedPassword })
    await newUser.save()
    return newUser
  } catch (e) {
    throw Error('Error on userServices.createUser' + e)
  }
}

exports.deleteUser = async id => {
  try {
    const user = await User.findByIdAndDelete(id)
    return true
  } catch (error) {
    throw new Error('Error on userServices.deleteUser')
  }
}

exports.updateUser = async (id, _user) => {
  try {
    const user = await User.findByIdAndUpdate(id, _user)
    return user
  } catch (error) {
    throw new Error('Error on userServices.updateUser')
  }
}

exports.getUserItems = async _id => {
  const items = await Item.find({ owner: _id })
  console.log(items)
}

//returns true if authenticated
//false if not
//null if user not found
exports.login = async ({ email, password }) => {
  try {
    //console.log(email, password)
    const user = await exports.getUserByEmail(email)

    if (user == null) {
      return { status: false }
    }
    const isSame = await bcrypt.compare(password, user.password)
    return { status: isSame }
  } catch (e) {
    throw Error('Error userServices.login - ' + e)
  }
}
