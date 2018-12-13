require 'aws-sdk-cloudformation'
require 'time'

module Aws; module Utils

class Stacks
    def initialize
        @cloudFormation = Aws::CloudFormation::Client.new(region: REGION)
    end

    def list
        return @cloudFormation.list_stacks
    end
    
    def exists? stack_name
        stacks = list
        stacks.each do |s|
            if stack_name == s.name && 'STACK_DELETED' != s.stack_status
                return true
            end
        end

        return false
    end

    def update stack_name
        stacks = list
        template_body = get_stack_config stack_name
        type = (exists? stack_name) ? "UPDATE" : "CREATE"
        change_set_name = build_change_set_name stack_name
        
        params = {
            stack_name: stack_name,
            template_body: template_body,
            change_set_type: type,
            change_set_name: change_set_name,
            capabilities: ["CAPABILITY_IAM"]
        }
        
        resp = @cloudFormation.create_change_set(params)

        return resp.stack_id
    end

    def build_change_set_name stack_name
        return stack_name + Time.now.utc.strftime('%Y%m%d%H%M')
    end

    def get_stack_config stack_name
        path = "cloudFormation/#{stack_name}.json"
        f = File.open(path, 'r')
        return f.read
    end

end

end; end