const mongoose = require('mongoose');
const geocoder = require('../utils/geocoder');

const CompanySchema = new mongoose.Schema({
  uid: {
    type: String,
    required: [true, 'Please include associated user id']
  },
  name: {
    type: String,
    required: [true, 'Please add a company name']
  },
  address: {
    type: String,
    required: [true, 'Please enter address']
  },
  location: {
    //GeoJSON Point
    type: {
      type: String,
      enum: ['Point'],
      required: false
    }, 
    coordinates: {
      type: [Number],
      required: false, 
      index: '2dsphere'
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },
  website: String,
  jobPostings: [String],
  updated: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now
  },
  notes: String, 
  keywords: [String]
});

//Geocoding location to create GeoJSON field
CompanySchema.pre('save', async function (next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  }

  next();
});

//Geocoding if location is updated 
CompanySchema.pre('updateOne', async function (next) {
  if(this.location.formattedAddress.toString() === this.address){
    return next();
  }

  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  }
  
  next();
})

CompanySchema.pre('save', async function (next) {
  const date = Date.now;
  this.updated = date;

  next();
})

module.exports = mongoose.model('Companies', CompanySchema);