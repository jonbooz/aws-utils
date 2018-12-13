# Aws::Utils

Welcome to your new gem! In this directory, you'll find the files you need to be able to package up your Ruby library into a gem. Put your Ruby code in the file `lib/aws/utils`. To experiment with that code, run `bin/console` for an interactive prompt.

TODO: Delete this and the text above, and describe your gem

## Installation

Add this line to your application's Gemfile:

```ruby
gem 'aws-utils'
```

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install aws-utils

## Usage

TODO: Write usage instructions here

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `rake spec` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

To install this gem onto your local machine, run `bundle exec rake install`. To release a new version, update the version number in `version.rb`, and then run `bundle exec rake release`, which will create a git tag for the version, push git commits and tags, and push the `.gem` file to [rubygems.org](https://rubygems.org).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/[USERNAME]/aws-utils.

## Design

The primary goal of **aws-utils** is to provide common AWS operations that would be shared across all of my AWS projects. The current plan is to support

1. Creating CloudFormation change sets.

### Creating a CloudFormation change set

This operation consists of the following component acts:

1. Get the existing stacks 
2. Determine if the given named stack exists
3. Load the CloudFormation file into memory
4. Create the change set (which is either CST_CREATE or CST_UPDATE)

There are essentially three inputs:

1. The name of the stack.
2. The location of the CloudFormation file.
3. The contents of the CloudFormation file.

The first two should be user provided options, but there should be support for conventional rules as well, namely, the stack name is the name of the current app (leaf directory), and the file will be found in `cloudFormation/name.json`. 

A script (that is installed to the user's machine) will drive this behavior, but it will be backed by an `Activity` class. The script will own pulling the defaults. The class will expose one method, `updateStack`, which will perform the above actions.