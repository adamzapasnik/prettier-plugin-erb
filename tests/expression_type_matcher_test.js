const expressionTypeMatcher = require('../lib/expression_type_matcher');

describe('if inlined', () => {
  test.each([
    ['<% if a then s end %>', 'plain'],
    ['<%- if a then s end -%>', 'plain'],
    ['<%- if a then s end-%>', 'plain'],
    ['<%-if a then s end-%>', 'plain'],
    ['<%-if a then s end -%>', 'plain'],

    ['<% if a then s else a end %>', 'plain'],
    ['<%- if a then s else a end -%>', 'plain'],
    ['<%- if a then s else a end-%>', 'plain'],
    ['<%-if a then s else a end-%>', 'plain'],
    ['<%-if a then s else a end -%>', 'plain'],

    ['<%= if a then s end %>', 'plain'],
    ['<%# if a then s end %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('unless inlined', () => {
  test.each([
    ['<% unless a then s end %>', 'plain'],
    ['<%- unless a then s end -%>', 'plain'],
    ['<%- unless a then s end-%>', 'plain'],
    ['<%-unless a then s end-%>', 'plain'],
    ['<%-unless a then s end -%>', 'plain'],

    ['<% unless a then s else a end %>', 'plain'],
    ['<%- unless a then s else a end -%>', 'plain'],
    ['<%- unless a then s else a end-%>', 'plain'],
    ['<%-unless a then s else a end-%>', 'plain'],
    ['<%-unless a then s else a end -%>', 'plain'],

    ['<%= unless a then s end %>', 'plain'],
    ['<%# unless a then s end %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('if', () => {
  test.each([
    ['<% if a %>', 'start'],
    ['<%- if a -%>', 'start'],
    ['<%- if a-%>', 'start'],
    ['<%-if a-%>', 'start'],
    ['<%-if a -%>', 'start'],

    ['<%= if a %>', 'plain'],
    ['<%# if a %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('unless', () => {
  test.each([
    ['<% unless a %>', 'start'],
    ['<%- unless a -%>', 'start'],
    ['<%- unless a-%>', 'start'],
    ['<%-unless a-%>', 'start'],
    ['<%-unless a -%>', 'start'],

    ['<%= unless a %>', 'plain'],
    ['<%# unless a %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('else', () => {
  test.each([
    ['<% else %>', 'middle'],
    ['<%else%>', 'middle'],
    ['<% else%>', 'middle'],
    ['<%else %>', 'middle'],

    ['<%- else -%>', 'middle'],
    ['<%-else-%>', 'middle'],
    ['<%- else-%>', 'middle'],
    ['<%-else -%>', 'middle'],

    ['<%# else %>', 'plain'],
    ['<%= else %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('elsif', () => {
  test.each([
    ['<% elsif a %>', 'middle'],
    ['<%- elsif a -%>', 'middle'],
    ['<%- elsif a-%>', 'middle'],
    ['<%-elsif a-%>', 'middle'],
    ['<%-elsif a -%>', 'middle'],

    ['<%= elsif a %>', 'plain'],
    ['<%# elsif a %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('end', () => {
  test.each([
    ['<% end %>', 'end'],
    ['<%end%>', 'end'],
    ['<% end%>', 'end'],
    ['<%end %>', 'end'],

    ['<%- end -%>', 'end'],
    ['<%-end-%>', 'end'],
    ['<%- end-%>', 'end'],
    ['<%-end -%>', 'end'],

    ['<%# end %>', 'plain'],
    ['<%= end %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('case', () => {
  test.each([
    ['<% case 0 when sm %>', 'start'],
    ['<%case 0 when sm%>', 'start'],
    ['<% case 0 when sm%>', 'start'],
    ['<%case 0 when sm %>', 'start'],

    ['<%- case 0 when sm -%>', 'start'],
    ['<%-case 0 when sm-%>', 'start'],
    ['<%- case 0 when sm-%>', 'start'],
    ['<%-case 0 when sm -%>', 'start'],

    ['<%# case 0 when sm %>', 'plain'],
    ['<%= case 0 when sm %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('when', () => {
  test.each([
    ['<% when 0 %>', 'middle'],
    ['<%when 0%>', 'middle'],
    ['<% when 0%>', 'middle'],
    ['<%when 0 %>', 'middle'],

    ['<%- when 0 -%>', 'middle'],
    ['<%-when 0-%>', 'middle'],
    ['<%- when 0-%>', 'middle'],
    ['<%-when 0 -%>', 'middle'],

    ['<%# when 0 %>', 'plain'],
    ['<%= when 0 %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('blocks', () => {
  test.each([
    ['<% @posts.each do |post| %>', 'start'],
    ['<%@posts.each do |post|%>', 'start'],
    ['<% @posts.each do |post|%>', 'start'],
    ['<%@posts.each do |post| %>', 'start'],
    ['<%- @posts.each do |post| -%>', 'start'],
    ['<%-@posts.each do |post|-%>', 'start'],
    ['<%- @posts.each do |post|-%>', 'start'],
    ['<%-@posts.each do |post| -%>', 'start'],

    ['<%#-@posts.each do |post| -%>', 'plain'],
    ['<%# @posts.each do |post| %>', 'plain'],

    ['<% content_for :body do %>', 'start'],
    ['<%content_for :body do%>', 'start'],
    ['<% content_for :body do%>', 'start'],
    ['<%content_for :body do %>', 'start'],
    ['<%- content_for :body do -%>', 'start'],
    ['<%-content_for :body do-%>', 'start'],
    ['<%- content_for :body do-%>', 'start'],
    ['<%-content_for :body do -%>', 'start'],

    ['<%#-content_for :body do -%>', 'plain'],
    ['<%# content_for :body do %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});

describe('plain', () => {
  test.each([
    ['<%# ss = ss -%>', 'plain'],
    ['<%# ss = ss %>', 'plain'],
    ['<%# ss = ss(\na: ss) %>', 'plain'],
  ])('matching %s returns %s type', (expression, type) => {
    expect(expressionTypeMatcher(expression)).toEqual({ type });
  });
});
