/*******************************************************************************
 * Copyright (C) 2013 Martin Gill
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

/// <reference path="../defs/knockout.d.ts" />
/// <reference path="../utils/datetime.ts" />
/// <reference path="../utils/events.ts" />

module TodoTxtJs
{
    export class Todo
    {
        public index:number = 0;
        public createdDate;
        public priority;
        public priorityScore;
        public completed;
        public completedDate;
        public contents;
        public projects;
        public contexts;
        public text;

        private _priority:string = null;
        private _createDate:string = null;
        private _completed:boolean = false;
        private _completedDate:string = null;
        private _contents:string = null;
        private _projects:string[] = [];
        private _contexts:string[] = [];
        private _text;

        constructor(source:string)
        {
            if (source !== undefined && typeof(source) !== 'string')
            {
                throw "argument is not a string.";
            }

            this._text = ko.observable<string>(source);
            this.initialiseComputedProperties();

            this.parse();
        }

        private initialiseComputedProperties() : void
        {
            this.text = ko.computed<string>(
            {
                owner: this,
                read: ()=>
                {
                    return this._text();
                },
                write: (value:string)=>
                {
                    this._text(value);
                    this.parse();
                }
            });

            this.createdDate = ko.computed<string>(
            {
                owner: this,
                read: ()=>
                {
                    this.parse();
                    return this._createDate;
                },
                write: (value:string)=>
                {
                    this._createDate = value;
                    this.render();
                }
            });

            this.priority = ko.computed<string>(
            {
                owner: this,
                read: ()=>
                {
                    this.parse();
                    return this._priority;
                },
                write: (value:string)=>
                {
                    this._priority = value;
                    this.render();
                }
            });

            this.priorityScore = ko.computed(
                {
                    owner: this,
                    read: ()=>
                    {
                        this.parse();
                        if (this._priority)
                        {
                            return this._priority.charCodeAt(0) - 64;
                        }
                        else
                        {
                            return 100;
                        }
                    }
                });

            this.completed = ko.computed(
                {
                    owner: this,
                    read: ()=>
                    {
                        this.parse();
                        return this._completed;
                    },
                    write: (value:boolean)=>
                    {
                        this._completed = value;
                        if (this._completed)
                        {
                            TodoTxtJs.Events.onComplete();
                            this._completedDate = DateTime.toISO8601Date(new Date());
                        }
                        else
                        {
                            this._completedDate = undefined;
                        }

                        this.render();
                    }
                });

            this.completedDate = ko.computed<string>(
            {
                owner: this,
                read: ()=>
                {
                    this.parse();
                    return this._completedDate;
                },
                write: (value:string)=>
                {
                    this._completedDate = value;
                    this.render();
                }
            });

            this.projects = ko.computed(
                {
                    owner: this,
                    read: ()=>
                    {
                        this.parse();
                        return this._projects;
                    }
                });

            this.contexts = ko.computed(
                {
                    owner: this,
                    read: ()=>
                    {
                        this.parse();
                        return this._contexts;
                    }
                });

            this.contents = ko.computed(
                {
                    owner: this,
                    read: ()=>
                    {
                        this.parse();
                        return this._contents;
                    }
                });
        }

        /**
         * Extracts all the flagged elements of a
         * @param text The text to examine
         * @param flag The flag character to search for (e.g. @ or +)
         * @return Array of lowercase matches, or undefined
         */
        private static findFlags(text, flag) : string[]
        {
            flag = flag.replace(/[\-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
            var regex = new RegExp("(?:\\W|^)" + flag + "([\\S_]+[A-Za-z0-9_](?!\\S))", 'g');
            var result = [];
            var match = regex.exec(text);
            while (match !== null)
            {
                result.push(match[1].toLowerCase());
                match = regex.exec(text);
            }

            return result;
        }

        /**
         * Parse text to extract Todo data.
         * @remarks This is quite a complex and hence slow method. It should only be
         *          called from computed values to ensure that the knockout framework
         *          can correctly do change detection and prevent it being called
         *          unnecessarily.
         */
        private parse() : void
        {
            // Matches:
            // 1: Completed ( == 'x' )
            // 2: Completed Date
            // 3: Priority
            // 4: Contents
            var parsingRegex = /^(?:(x) (?:((?:19|20)[0-9]{2}[\- \/.](?:0[1-9]|1[012])[\- \/.](?:0[1-9]|[12][0-9]|3[01])) )?)?(?:(?:\(([A-Z])\)) )?(?:((?:19|20)[0-9]{2}[\- \/.](?:0[1-9]|1[012])[\- \/.](?:0[1-9]|[12][0-9]|3[01])) )?(.+)$/;

            this._priority = null;
            this._createDate = null;
            this._completed = false;
            this._completedDate = null;
            this._contents = null;
            this._projects = [];
            this._contexts = [];

            if (this._text() === undefined)
            {
                return;
            }

            var match = parsingRegex.exec(this._text());
            if (match !== null)
            {
                if (match[1] === 'x')
                {
                    this._completed = true;

                    if (match[2])
                    {
                        this._completedDate = match[2];
                    }
                }

                if (match[3])
                {
                    this._priority = match[3];
                }

                if (match[4])
                {
                    this._createDate = match[4];
                }

                if (match[5])
                {
                    this._contents = match[5];
                }

                this._projects = Todo.findFlags(this._contents, '+');
                this._contexts = Todo.findFlags(this._contents, '@');
            }
        }

        private render() : void
        {
            var result = '';
            if (this._completed)
            {
                result += 'x ';
                if (this._completedDate)
                {
                    result += this._completedDate + ' ';
                }
            }

            if (this._priority)
            {
                result += '(' + this._priority + ') ';
            }

            if (this._createDate)
            {
                result += this._createDate + ' ';
            }

            if (this._contents)
            {
                result += this._contents;
            }

            this._text(result);
        }
    }

}
