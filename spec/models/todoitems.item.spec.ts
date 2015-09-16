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
/// <reference path="../../src/typings/jasmine/jasmine.d.ts" />
/// <reference path="../../src/models/item.ts" />

namespace TodoTxt.Models.Specs
{
    describe('Models.Item', () =>
    {
        describe('constructor', () =>
        {
            it('constructs a valid class', () =>
            {
                var tokens = [new Token(TokenType.text, 'This is some text')];
                expect(new Item(tokens)).not.toBe(null);
            });

            it('throws if no tokens given', () =>
            {
                expect(() =>
                {
                    new Item(null)
                }).toThrow();
            });

            it('initializes index to zero', () =>
            {
                var tokens = [new Token(TokenType.text, 'This is some text')];
                expect(new Item(tokens).index).toBe(0);
            });
        });

        describe('completed', () =>
        {
            var tokensComplete = [
                new Token(TokenType.completed, '2015-05-01'),
                new Token(TokenType.text, 'This is some text')
            ];

            var tokensNotComplete = [
                new Token(TokenType.text, 'This is some text')
            ];

            it('correctly indicates completed todo', () =>
            {
                var target = new Item(tokensComplete);
                expect(target.completed()).toBe(true);
            });

            it('correctly indicates not completed todo', () =>
            {
                var target = new Item(tokensNotComplete);
                expect(target.completed()).toBe(false);
            });

            it('correctly returns complete date', () =>
            {
                var target = new Item(tokensComplete);
                expect(target.completedDate()).toBe('2015-05-01');
            });

            it('correctly returns null for completed date when not complete', () =>
            {
                var target = new Item(tokensNotComplete);
                expect(target.completedDate()).toBe(null);
            });
        });

        describe('priority', () =>
        {
            it('correctly returns priority', () =>
            {
                var tokens = [
                    new Token(TokenType.priority, 'A'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.priority()).toBe('A');
            });

            it('correctly returns null if no priority set', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.priority()).toBe(null);
            });
        });

        describe('create date', () =>
        {
            it('correctly returns create date', () =>
            {
                var tokens = [
                    new Token(TokenType.createDate, '2015-05-15'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.createDate()).toBe('2015-05-15');
            });

            it('correctly returns null if no create date set', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.createDate()).toBe(null);
            });
        });

        describe('projects', () =>
        {
            it('correctly returns project', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.project, 'project'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.projects().length).toBe(1);
            });

            it('correctly returns project text', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.project, 'project'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.projects()[0]).toBe('project');
            });

            it('correctly returns empty array for no projects', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.projects().length).toBe(0);
            });

            it('correctly returns multiple projects', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.project, 'projectA'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.project, 'projectB'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.project, 'projectC'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.projects().length).toBe(3);
            });

            it("correctly returns multiple projects' text", () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.project, 'projectA'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.project, 'projectB'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.project, 'projectC'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.projects()).toContain('projectA');
                expect(target.projects()).toContain('projectB');
                expect(target.projects()).toContain('projectC');
            });

        });

        describe('contexts', () =>
        {
            it('correctly returns context', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.context, 'context'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.contexts().length).toBe(1);
            });

            it('correctly returns context text', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.context, 'context'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.contexts()[0]).toBe('context');
            });

            it('correctly returns empty array for no contexts', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.contexts().length).toBe(0);
            });

            it('correctly returns multiple contexts', () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.context, 'contextA'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.context, 'contextB'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.context, 'contextC'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.contexts().length).toBe(3);
            });

            it("correctly returns multiple contexts' text", () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.context, 'contextA'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.context, 'contextB'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.context, 'contextC'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.contexts()).toContain('contextA');
                expect(target.contexts()).toContain('contextB');
                expect(target.contexts()).toContain('contextC');
            });

        });

        describe('metadata', () =>
        {
            it("correctly returns multiple metadata entries", () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataA', 'A'),
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataB', 'B'),
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataC', 'C'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.metadata().length).toBe(3);
            });

            it("correctly returns empty array for no metadata entries", () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.metadata().length).toBe(0);
            });

            it("correctly returns metadata value", () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataA', 'A'),
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataB', 'B'),
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataC', 'C'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.metadataValue('metadataB')).toBe('B');
            });

            it("correctly returns first metadata value found", () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataA', 'A'),
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataA', 'B'),
                    new Token(TokenType.text, 'This is some text'),
                    new Metadata.GenericMetadata('metadataA', 'C'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.metadataValue('metadataA')).toBe('A');
            });

            it("correctly returns null for no metadata value", () =>
            {
                var tokens = [
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.text, 'This is some text'),
                    new Token(TokenType.text, 'This is some text')
                ];
                var target = new Item(tokens);
                expect(target.metadataValue('bob')).toBe(null);
            });
        });
    });
}