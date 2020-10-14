import { Button, Breadcrumb } from 'antd';

const BreadcrumbHeader = (props) => {
  const styles = {
    minHeight: 50,
    width: '100%',
    backgroundColor: 'white',
    padding: '10px 32px',
    borderBottom: '1px solid #F0F2F5',
    borderTop: '1px solid #F0F2F5',
  };
  const childStyle = {
    width: '50%',
    display: 'inline-block',
  };
  const gobackStyle = {
    marginBottom: '10px',
  };
  function goback() {
    window.history.back();
  }
  return (
    <div style={styles}>
      <div style={childStyle}>
        {props.isShowGoback ? (
          <Button onClick={goback} style={gobackStyle}>
            返回
          </Button>
        ) : null}
        <Breadcrumb>
          {props.BreadcrumbList.map((item, index) => {
            return (
              <Breadcrumb.Item key={index}>
                {item.moduleRoute ? (
                  // <Link to={item.moduleRoute}>{item.moduleName}</Link>
                  <a href={item.moduleRoute}>{item.moduleName}</a>
                ) : (
                  item.moduleName
                )}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      </div>
      <div style={{ ...childStyle, textAlign: 'right' }}>{props.children}</div>
    </div>
  );
};
export default BreadcrumbHeader;
