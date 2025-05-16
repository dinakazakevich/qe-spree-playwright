# Spree eCommerce Technical Assessment

This is a technical assessment for Quality Engineering using Spree Commerce platform.

## About Spree Commerce

This project uses [Spree Commerce](https://spreecommerce.org) - the open-source e-commerce platform for Rails. It is a great starting point for any Rails developer to quickly build an e-commerce application.

This starter uses:

* Spree Commerce 5 which includes Admin Dashboard, API and Storefront
* Ruby 3.3 and Ruby on Rails 7.2
* [Devise](https://github.com/heartcombo/devise) for authentication
* [Solid Queue](https://github.com/rails/solid_queue) with Mission Control UI (access only to Spree admins) for background jobs
* [Solid Cache](https://github.com/rails/solid_cache) for excellent caching and performance
* PostgreSQL as a database

## Local Installation

Please follow [Spree Quickstart guide](https://spreecommerce.org/docs/developer/getting-started/quickstart) to setup your Spree application using the Spree starter.

## Basic Playwright end-to-end framework
- Directory [playwright](https://github.com/dinakazakevich/qe-spree-playwright/tree/main/playwright)
- Detailed [documentation on the framework](https://github.com/dinakazakevich/qe-spree-playwright/blob/main/playwright/README.md)

## Deployment

Please follow [Deployment guide](https://spreecommerce.org/docs/developer/deployment/render) to quickly deploy your production-ready Spree application.

## Troubleshooting

### libvips error

If you encounter an error like the following:

```bash
LoadError: Could not open library 'vips.so.42'
```

Please check that libvips is installed with `vips -v`, and if it is not installed, follow [installation instructions here](https://www.libvips.org/install.html).
