import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';

interface User {
  id: string,
  nams: string,
  username: string
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  public dataSource: MatTableDataSource<User> = new MatTableDataSource<User>([]);
  public displayedColumns: string[] = ['id', 'name', 'username'];

  public firstArray: any = [];
  public secondArray: any = [
    {
      id: '123',
      name: 'Danila',
      username: 'douluvme'
    },
    {
      id: '333',
      name: 'Da',
      username: 'Da'
    },
    {
      id: 444,
      name: 'Net',
      username: 'Net'
    }
  ];
  public thirdArray: any = [];

  public resultArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  private _subscriptions: Subscription[] = [];

  private sortType = 'normal';
  private currentField = '';

  constructor(
    private _http: HttpClient
  ) {}

  ngOnDestroy(): void {
    this._subscriptions.forEach((subscriptiopn: Subscription) => {
      subscriptiopn.unsubscribe();
    })
  }

  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this._subscriptions.push(
      this.resultArray.subscribe((data: any) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.sort = this.sort;
      })
    );

    this._subscriptions.push(
      this._http.get('https://jsonplaceholder.typicode.com/users')
      .subscribe(
        (data: any) => {
          this.firstArray = data;
          this._createResultArray(this.firstArray, this.secondArray, this.thirdArray);
        },
        (error) => {
          console.error(error);
        }
      )
    );

    this._subscriptions.push(
      this._http.get('https://jsonplaceholder.typicode.com/users')
      .subscribe(
        (data: any) => {
          this.thirdArray = data;
          this._createResultArray(this.firstArray, this.secondArray, this.thirdArray);
        },
        (error) => {
          console.error(error);
        }
      )
    );

  }

  private _createResultArray(firstArray: any[], secondArray: any[], thirdArray: any[]) {
    let newArray: any[] = [];
    if (firstArray.length) {
      newArray.push({id: 'To By', name: '', username: ''});
      newArray = [...newArray, ...firstArray];
    }
    if (secondArray.length) {
      newArray.push({id: 'To Sell', name: '', username: ''});
      newArray = [...newArray, ...secondArray];
    }

    if (thirdArray.length) {
      newArray.push({id: 'No changes', name: '', username: ''});
      newArray = [...newArray, ...thirdArray];
    }
    this.resultArray.next(newArray);
  }

  public orderTable(field: string) {
    this._setSortProperties(field);

    let newFirstArray = [...this.firstArray];
    let newSecondArray = [...this.secondArray];
    let newThirdArray = [...this.thirdArray];

    let direction = 0;
    if (this.sortType === 'asc') {
      direction = 1;
    } else if (this.sortType === 'desc') {
      direction = -1;
    } else if (this.sortType === 'normal') {
      direction = 0;
    }
    let compare = (a: any, b: any,) => {
      if (!direction) {
        return 0;
      }
      let field = this.currentField;
      if ( a[field] < b[field] ){
        return -1 * direction;
      }
      if ( a[field] > b[field] ){
        return 1 * direction;
      }
      return 0;
    }

    newFirstArray.sort(compare);
    newSecondArray.sort(compare);
    newThirdArray.sort(compare);

    this._createResultArray(newFirstArray, newSecondArray, newThirdArray);
  }

  private _setSortProperties(field: string) {
    if (this.currentField !== field) {
      this.currentField = field;
      this.sortType = 'asc';
    } else if(this.sortType === 'asc') {
      this.sortType = 'desc';
    } else if (this.sortType === 'desc') {
      this.sortType = 'normal';
    } else if (this.sortType === 'normal') {
      this.sortType = 'asc';
    }
  }

}
