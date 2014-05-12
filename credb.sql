SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

DROP SCHEMA IF EXISTS `ERApp` ;
CREATE SCHEMA IF NOT EXISTS `ERApp` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `ERApp` ;

-- -----------------------------------------------------
-- Table `ERApp`.`users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ERApp`.`users` ;

CREATE TABLE IF NOT EXISTS `ERApp`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fName` VARCHAR(45) NULL,
  `lName` VARCHAR(45) NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ERApp`.`expenses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ERApp`.`expenses` ;

CREATE TABLE IF NOT EXISTS `ERApp`.`expenses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `vendor` VARCHAR(100) NULL DEFAULT 'Default Vendor',
  `location` VARCHAR(100) NULL DEFAULT 'Default Location',
  `type` VARCHAR(100) NULL DEFAULT 'Default Expense',
  `amount` DECIMAL(12,2) NULL DEFAULT 0.00,
  `currency` VARCHAR(20) NULL DEFAULT 'USD',
  `occurred` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `receipt` BLOB NULL,
  `note` VARCHAR(5000) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `I_expense_vendor` (`vendor` ASC),
  INDEX `fk_expense_users_idx` (`user_id` ASC),
  CONSTRAINT `fk_expense_users`
    FOREIGN KEY (`user_id`)
    REFERENCES `ERApp`.`users` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ERApp`.`corp_users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ERApp`.`corp_users` ;

CREATE TABLE IF NOT EXISTS `ERApp`.`corp_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fName` VARCHAR(45) NULL DEFAULT 'DefaultFirst',
  `lName` VARCHAR(45) NULL DEFAULT 'DefaultLast',
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NULL,
  `corpName` VARCHAR(45) NULL DEFAULT 'ERAppOrg',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `ERApp`.`corp_expenses`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `ERApp`.`corp_expenses` ;

CREATE TABLE IF NOT EXISTS `ERApp`.`corp_expenses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL,
  `vendor` VARCHAR(100) NULL DEFAULT 'Default Vendor',
  `location` VARCHAR(100) NULL DEFAULT 'Default Location',
  `type` VARCHAR(100) NULL DEFAULT 'Default Expense',
  `amount` DECIMAL(12,2) NULL DEFAULT 0.00,
  `currency` VARCHAR(20) NULL DEFAULT 'USD',
  `occurred` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `receipt` BLOB NULL,
  `note` VARCHAR(5000) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `I_expense_vendor` (`vendor` ASC),
  CONSTRAINT `fk_expense_users0`
    FOREIGN KEY (`id`)
    REFERENCES `ERApp`.`corp_users` (`id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
