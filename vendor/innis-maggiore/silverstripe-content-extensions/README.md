# SEO Content Extensions Module

This module adds fields to the CMS for `H1`, `PageTitle` and `MetaKeywords` to the `Page` class.

## Overview

This module adds new CMS Fields for `H1`, `PageTitle`, and `MetaKeywords` to the `Page` class and all its children.

The `H1` field should be used for semantic markup, and included in page templates rendered as an `<h1>` field.

`PageTitle` (meta title) is added to the Metadata drawer on all pages. It should be added to the top-level `Page.ss` template and rendered as the title of the page when set.

`MetaKeywords` is added to the Metadata drawer on all pages. However, since the `keywords` meta field is no longer used for SEO, this field is used simply as a reference for content editors.

## Installation

Run on the command line:

	$ composer require innis-maggiore/silverstripe-content-extensions ^4.0

or include `"innis-maggiore/silverstripe-content-extensions": "^4.0"` in your project's `composer.json` and run:

	$ composer update
	
Once installed, be sure to run a `/dev/build` and flush your Silverstripe cache for the module to take effect.

Use the `1.0` tag ([ss3 branch](https://github.com/innis-maggioree/silverstripe-content-extensions/tree/ss3)) for SilverStripe 3 sites.

## Usage

Page templates will need adjusted to take advantage of the new fields.

To add the `H1` field to a page template, insert it to be rendered semantically as an `<h1>` tag: 

    <% if $H1 %>
        <h1>{$H1}</h1>
    <% end_if %>

To add the `PageTitle` (meta title) to a page template, adjust the top-level `Page.ss` template to render the `<title>` tag as:

    <title><% if $PageTitle %>$PageTitle<% else %>$Title<% end_if %> &raquo; $SiteConfig.Title</title>
