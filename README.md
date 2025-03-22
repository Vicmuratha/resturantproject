# RESTAURANT POS SYSTEM

## Table Of Content
1. [Introduction](#introduction)
2. [Features](#features)
3. [System requirements](#system-requirements)
4. [Installation guide](#installation-guide)

## Introduction
This is a point of sale system built using JavaScript that manages the functionalities of a restaurant.

## Features
1. Order management
    - Making orders
    - Tracking orders
    - Cancelling orders
    - Resloving orders
2. POS management
    - Making sales
3. Report generation
    - Daily reports
    - Weekly reports
    - Monthly reports
    - Yearly reports
4. Payment management
    - Tracking
    - Making payments
    - Reviewing payments
5. Online menu


## System Requirements
- MySQL 8
- Node 18

## Installation Guide
1. Clone the github repository
```commandline
git clone https://github.com/Jim-03/restaurant.git
cd restaurant
```
2. Add the database to a file named `.env` in the project's folder with the following content:
```commandline
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=_your_database_name, preferably restaurant
DB_HOST=your_database_host e.g. localhost
DB_PORT=your_database_port e.g. 3306
```
3. Create a database named in `DB_NAME` above in MySQL
4. Execute the module named `createDatabase.js` to create the database structure by running:
> node createDatabase.js
- It should output 
```commandline
Connected to the database
Database & tables created!
```
5. Install dependencies
```commandline
npm install
```
6. Start the app
```commandline
npx nodemon app
```
7. Visit the link provided. It should be displayed as:
> http://localhost:5123/