require 'aws-sdk-cloudformation'

RSpec.describe Aws::Utils do
  it "has a version number" do
    expect(Aws::Utils::VERSION).not_to be nil
  end

  it "gets existing stacks - there are no stacks" do
    cloudFormationClient = expectCloudFormationClient
    expect(cloudFormationClient).to receive(:list_stacks).and_return([ ])

    expect(Aws::Utils::Stacks.new.list).to eq([ ])
  end

  it "gets existing stacks - there is a stack" do
    cloudFormationClient = expectCloudFormationClient

    stacks = double('stacks')
    expect(cloudFormationClient).to receive(:list_stacks).and_return(stacks)

    expect(Aws::Utils::Stacks.new.list).to eq(stacks)
  end

  it "determines if named stack exists - it does exist" do
    name = "stack"
    instance = Aws::Utils::Stacks.new

    stack = double
    expect(stack).to receive(:name).and_return(name)
    expect(stack).to receive(:stack_status).and_return('STACK_OK')

    expect(instance).to receive(:list).and_return([stack])

    expect(instance.exists? name).to eq(true)
  end 

  it "determines if named stack exists - it does not exist" do
    name = "stack"
    instance = Aws::Utils::Stacks.new

    stack = double
    expect(stack).to receive(:name).and_return(name)

    expect(instance).to receive(:list).and_return([stack])

    expect(instance.exists? "some other name").to eq(false)
  end 

  it "determines if named stack exists and is not deleted - is is deleted" do
    name = "stack"
    instance = Aws::Utils::Stacks.new

    stack = double
    expect(stack).to receive(:name).and_return(name)
    expect(stack).to receive(:stack_status).and_return('STACK_DELETED')

    expect(instance).to receive(:list).and_return([stack])

    expect(instance.exists? name).to eq(false)
  end

  it "generates a change set name" do
    name = 'name'

    time = Time.new(2018, 12, 12, 21, 23)
    timenow = double
    expect(Time).to receive(:now).and_return(timenow)
    expect(timenow).to receive(:utc).and_return(time)

    instance = Aws::Utils::Stacks.new
    expect(instance.build_change_set_name name).to eq(name + '201812122123')
  end

  it "loads stack config file" do
    name = 'name'
    file_contents = '{ "file_contents": true }'

    file = double
    expect(File).to receive(:open).and_return(file)
    expect(file).to receive(:read).and_return(file_contents)

    instance = Aws::Utils::Stacks.new
    expect(instance.get_stack_config name).to eq(file_contents)
  end

  it "creates a new stack - expect params" do
    name = 'name'
    change_set_name = 'name201812122123'
    id = 'id'
    file_contents = '{ "file_contents": true }'

    cloudFormationClient = expectCloudFormationClient
    instance = Aws::Utils::Stacks.new
    expect(instance).to receive(:list).and_return([ ])
    expect(instance).to receive(:exists?).and_return(false)
    expect(instance).to receive(:build_change_set_name).and_return(change_set_name)
    expect(instance).to receive(:get_stack_config).and_return(file_contents)

    expected_params = {
      stack_name: name,
      template_body: file_contents,
      change_set_type: 'CREATE',
      change_set_name: change_set_name,
      capabilities: ["CAPABILITY_IAM"]
    }

    result = double
    expect(result).to receive(:stack_id).and_return(id)
    expect(cloudFormationClient).to receive(:create_change_set).with(expected_params).and_return(result)

    expect(instance.update name).to eq(id)
  end

  def expectCloudFormationClient
    cloudFormationClient = double('client')
    expect(Aws::CloudFormation::Client).to receive(:new).and_return(cloudFormationClient)
    return cloudFormationClient
  end
end
