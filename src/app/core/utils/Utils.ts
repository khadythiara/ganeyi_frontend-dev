import { Injectable } from '@angular/core';
import jwt_decode from "jwt-decode";

@Injectable({ providedIn: 'root' })
export class Utils {
  currentYear = new Date((new Date()).getFullYear(), 0, 1);
  nextYear = new Date(this.currentYear.getFullYear() + 1, 0, 1);

  constructor() { }

  dateAdd(date: Date, amount: number, duration: string): Date {
    let newDate = date;
    switch (duration) {
      case 'day':
        newDate.setDate(date.getDate() + amount);
        break;
      case 'month':
        newDate.setMonth(date.getMonth() + amount);
        break;
      case 'year':
        newDate.setFullYear(date.getFullYear() + amount);
        break;

      default:
        break;
    }

    return new Date(newDate);
  }

  /**
  * Format date into string without time part
  * @param date
  * @returns Date
  */
  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  getDayDiff(startDate: string, endDate: string): number {
    const msInDay = 24 * 60 * 60 * 1000;

    return Math.round(Math.abs(Number(Date.parse(endDate)) - Number(Date.parse(startDate))) / msInDay);
  }


  isAgent() {
    let currentUser = JSON.parse(`${localStorage.getItem('currentUser')}`);
    let userToken: any = jwt_decode(currentUser.access_token)
    if (userToken.realm_access.roles.includes('AGENT')) 
      return true
    else return false
  }
}