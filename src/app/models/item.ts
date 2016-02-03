/*******************************************************************************
 * Copyright (C) 2013-2015 Martin Gill
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/

import {Tokenizer} from '../transforms/tokenizer';
import {Token, TokenType} from './token';
import {GenericMetadata} from './metadata/metadata'
import {StringSerializer, HtmlSerializer} from '../transforms/serializers/serializer'

export class Item {
  private item_tokens:Token[];
  public index:number = 0;

  constructor(tokens:Token[]) {
    if (tokens === null) {
      throw "No tokens given";
    }

    this.item_tokens = tokens;
  }

  public removed():boolean {
    return this.item_tokens.length === 0;
  }

  public remove():void {
    this.item_tokens = [];
  }

  public static parseString(text:string):Item {
    return new Item(Tokenizer.tokenize(text));
  }

  public tokens():Token[] {
    return this.item_tokens;
  }

  public complete() {
    if (this.completed())
    {
      this.item_tokens =
      this.item_tokens.filter((item) => { return item.type != TokenType.completed });
    }
    else
    {
      this.item_tokens.splice(0,0,new Token(TokenType.completed, "2015-01-01"));
    }
  }

  public completed():boolean {
    return this.findTokens(TokenType.completed).length == 1;
  }

  public completedDate():string {
    var tokens = this.findTokens(TokenType.completed);
    if (tokens.length == 0) {
      return null;
    }
    return tokens[0].text;
  }

  public priority():string {
    var tokens = this.findTokens(TokenType.priority);
    if (tokens.length == 0) {
      return null;
    }
    return tokens[0].text;
  }

  // TODO: Write tests
  public setCreateDate(date:string):void {
    var tokens = this.findTokens(TokenType.createDate);
    if (tokens.length == 0) {
      var created = new Token(TokenType.createDate, date);
      if (this.completed()) {
        this.item_tokens.splice(1, 0, created);
      }
      else {
        this.item_tokens.splice(0, 0, created);
      }
    }
    else {
      tokens[0].text = date;
    }
  }

  public createDate():string {
    var tokens = this.findTokens(TokenType.createDate);
    if (tokens.length == 0) {
      return null;
    }
    return tokens[0].text;
  }

  public projects():string[] {
    var tokens = this.findTokens(TokenType.project);
    return tokens.map(function (item) {
      return item.text
    });
  }

  public contexts():string[] {
    var tokens = this.findTokens(TokenType.context);
    return tokens.map(function (item) {
      return item.text
    });
  }

  public metadata():GenericMetadata[] {
    return this.findTokens(TokenType.metadata);
  }

  public metadataValue(id:string):string {
    var metadata = this.metadata().filter((item) => {
      return item.id == id
    });
    return metadata.length > 0 ? metadata[0].text : null;
  }

  public toString():string {
    return new StringSerializer().serialize(this.item_tokens);
  }

  public toHtml():string {
    return new HtmlSerializer().serialize(this.item_tokens);
  }

  private findTokens(type:TokenType):Token[] {
    return this.item_tokens.filter(function (item) {
      return item.type == type;
    });
  }
}